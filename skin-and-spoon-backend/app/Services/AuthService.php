<?php

namespace App\Services;
use App\Models\{
    User,
    MailTemplate,
    MailVerification
};
use Illuminate\Support\Facades\{
    Hash,
    Auth,
    Mail,
    Validator
};

class AuthService {
    public static function loginOrRegister($request)
    {
        $email = $request->input('email');

        $user = User::where('email', $email)->first();
        
        if ($user) {
            return response()->json([
                'message' => 'Proceed to login',
                'error' => 0
            ]);
        } else {
            $verificationToken = \Str::random(40);
            self::sendVerificationEmail($email, $verificationToken);
        }

    }
    public static function sendVerificationEmail($email, $verificationToken = null)
    {
        if (!$verificationToken) {
            $verificationToken = \Str::random(40);
        }

        $existingRecord = MailVerification::where('email', $email)->first();

        if ($existingRecord) {
            $verificationToken = \Str::random(40);
            $existingRecord->update([
                'token' => $verificationToken,
                'expires_at' => now()->addMinutes(30),
            ]);
        } else {
            MailVerification::create([
                'email' => $email,
                'token' => $verificationToken,
                'expires_at' => now()->addMinutes(30),
                'status' => 1,
            ]);
        }

        $template = MailTemplate::where('name', 'verification_email')->first();

        if (!$template) {
            \Log::error('Mail template not found: verification_email');
             return response()->json([
                'message' => 'Mail template not found: verification_email',
                'error' => 1
            ]);
        }
    
        $verificationUrl = url('api/auth/verify-email/' . $verificationToken);
        $emailBody = str_replace('{{url}}', $verificationUrl, $template->body);
        Mail::raw($emailBody, function ($message) use ($email, $template) {
            $message->to($email)
                    ->subject($template->subject);
        });
    }
    public static function verifyEmail($token)
    {
        $record = MailVerification::where('token', $token)->where('status',1)->first();

        if (!$record) {
            return response()->json([
                'message' => 'Invalid token.',
                'error' => 0
            ], 200);
        }

        if ($record->status == 9) {
            return response()->json([
                'message' => 'The verification token has expired.',
                'error' => 0
            ], 200);
        }

        $record->status = 9;
        $record->save();

        return response()->json([
            'message' => 'Email verified successfully. Please proceed to registration.',
            'error' => 0,
            'data' => ['email' => $record->email] 
        ]);
    }
    public static function register($request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email|exists:mail_verifications,email',
            'password' => 'required|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error.',
                'errors' => $validator->errors(),
                'error' => 1
            ], 400);
        }

        $verification = MailVerification::where('email', $request->input('email'))
                                         ->where('status', 1) 
                                         ->first();
        if (!$verification) {
            return response()->json([
                'message' => 'Email not verified or invalid.',
                'error' => 1
            ], 400);
        }

        User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'email_verified_at' => $verification->updated_at,
            'verification_token' => $verification->token,
            'is_verified' => 1,
            'password' => Hash::make($request->input('password')), // BCrypt hashing
        ]);

        $verification->status = 9;
        $verification->save();

        return response()->json([
            'message' => 'Registration successful.',
            'error' => 0
        ]);
    }
    public static function login($request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'password' => 'required|string|min:8',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error.',
                'errors' => $validator->errors(),
                'error' => 1
            ], 200);
        }
    
        $user = User::where('email', $request->input('email'))->first();

        if (!$user || !Hash::check($request->input('password'), $user->password)) {
            return response()->json([
                'message' => 'Invalid email or password.',
                'error' => 1
            ], 200);
        }

        // Generate JWT Token
        $accessToken = $user->createToken('SkinAndSpoon')->accessToken;
        $refreshToken = $user->createToken('SkinAndSpoon')->refreshToken;

        return response()->json([
            'message' => 'Login successful',
            'error' => 0,
            'data' => [
                'user' => $user,
                'access_token' => $accessToken->token,
                'refresh_token' => $refreshToken->token,
            ]
        ]);
    }
}

?>