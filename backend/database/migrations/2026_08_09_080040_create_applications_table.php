<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();

            $table->string('application_no')->unique();

            // Correct: user_id
            $table->foreignId('user_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // Temporarily keep this without constrained()
            $table->unsignedBigInteger('service_id');

            $table->enum('status', [
                'pending',
                'approved',
                'rejected',
                'in_progress'
            ])->default('pending');

            $table->date('applied_date');
            $table->date('due_date')->nullable();
            $table->date('approved_date')->nullable();

            $table->text('remarks')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};