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
    Schema::table('users', function (Blueprint $table) {
        $table->string('mobile', 10)->unique()->nullable()->after('email');
        $table->string('aadhaar_number', 12)->unique()->nullable()->after('mobile');
        $table->enum('gender', ['male', 'female', 'other'])->nullable()->after('aadhaar_number');
        $table->date('dob')->nullable()->after('gender');
    });
}

    /**
     * Reverse the migrations.
     */
   public function down(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn([
            'mobile',
            'aadhaar_number',
            'gender',
            'dob',
        ]);
    });
}
};
