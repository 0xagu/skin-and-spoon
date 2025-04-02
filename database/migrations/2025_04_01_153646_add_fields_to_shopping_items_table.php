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
        Schema::table('shopping_items', function (Blueprint $table) {
            $table->string('unit')->nullable()->after('quantity');
            $table->string('latitude')->nullable()->after('order');
            $table->string('longitude')->nullable()->after('latitude');
            $table->string('shop_name')->nullable()->after('longitude');
            $table->string('remarks')->nullable()->after('shop_name');
            $table->integer('created_by')->after('remarks');
            $table->integer('assign_to')->nullable()->after('created_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shopping_items', function (Blueprint $table) {
            $table->dropColumn('unit'); 
            $table->dropColumn('latitude'); 
            $table->dropColumn('longitude'); 
            $table->dropColumn('shop_name'); 
            $table->dropColumn('remarks'); 
            $table->dropColumn('created_by'); 
            $table->dropColumn('assign_to'); 
        });
    }
};
