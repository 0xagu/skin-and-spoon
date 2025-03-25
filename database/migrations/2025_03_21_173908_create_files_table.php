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
        Schema::create('files', function (Blueprint $table) {
            $table->id();
            $table->string('original_name');
            $table->bigInteger('size_bytes');
            $table->string('dimension')->nullable();
            $table->string('file_type');
            $table->string('unique_filename');
            $table->text('tmp_location');
            $table->text('real_location');
            $table->unsignedBigInteger('related_id')->nullable();
            $table->string('related_column')->nullable();
            $table->string('related_model')->nullable();
            $table->integer('status')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('files');
    }
};
