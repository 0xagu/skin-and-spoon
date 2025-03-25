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
        Schema::table('files', function (Blueprint $table) {
            $table->dropColumn(['related_id', 'related_column', 'related_model','status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('files', function (Blueprint $table) {
            $table->unsignedBigInteger('related_id')->nullable();
            $table->string('related_column')->nullable();
            $table->string('related_model')->nullable();
            $table->tinyInteger('status')->nullable();
        });
    }
};
