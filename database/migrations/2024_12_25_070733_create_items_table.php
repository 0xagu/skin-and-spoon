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
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->unsigned();
            $table->string('name');
            $table->integer('priority');
            $table->unsignedBigInteger('item_category_id');
            $table->integer('quantity');
            $table->timestamp('acquire_date')->nullable();
            $table->timestamp('expiration_date')->nullable();
            $table->timestamps();

            $table->foreign('item_category_id')->references('id')->on('item_categories')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
