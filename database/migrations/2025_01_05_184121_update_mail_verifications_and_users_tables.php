<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('mail_verifications', function (Blueprint $table) {
            $table->boolean('is_verified')->default(false)->after('email');
            $table->timestamp('email_verified_at')->nullable()->after('is_verified');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('verification_token');
            $table->dropColumn('email_verified_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mail_verifications', function (Blueprint $table) {
            $table->dropColumn('is_verified');
            $table->dropColumn('email_verified_at');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->string('verification_token')->nullable()->after('email');
            $table->string('email_verified_at')->nullable()->after('email');
        });
    }
};
