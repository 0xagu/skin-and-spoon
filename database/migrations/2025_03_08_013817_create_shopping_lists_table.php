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
        Schema::create('shopping_lists', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique();
            $table->string('name');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); 
            $table->integer('status')->default('1');
            $table->timestamps();
        });

        Schema::create('shopping_items', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique();
            $table->foreignId('shopping_list_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->integer('quantity')->default(1);
            $table->integer('priority')->default(0);
            $table->integer('order')->default(0);
            $table->integer('status')->default('1');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shopping_items');
        Schema::dropIfExists('shopping_lists');
    }
};
