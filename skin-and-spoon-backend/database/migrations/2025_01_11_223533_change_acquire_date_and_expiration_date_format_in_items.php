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
        Schema::table('items', function (Blueprint $table) {
            $table->date('acquire_date')->change();
            $table->date('expiration_date')->change();
            $table->integer('status')->after('expiration_date')->default(1);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dateTime('acquire_date')->change();
            $table->dateTime('expiration_date')->change();
            $table->dropColumn('status');
        });
    }
};
