<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        foreach (['item_categories', 'items', 'mail_templates', 'users'] as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->uuid('uuid')->unique()->after('id')->nullable();
            });
        }

        foreach (['item_categories', 'items', 'mail_templates', 'users'] as $table) {
            \DB::table($table)->whereNull('uuid')->update([
                'uuid' => \DB::raw('(UUID())')
            ]);
        }

        foreach (['item_categories', 'items', 'mail_templates', 'users'] as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->uuid('uuid')->unique()->nullable(false)->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        foreach (['item_categories', 'items', 'mail_templates', 'users'] as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->dropColumn('uuid');
            });
        }
    }
};
