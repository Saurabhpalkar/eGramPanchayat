<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            // Application for which payment is made
            $table->foreignId('application_id')
                ->constrained('applications')
                ->cascadeOnDelete();

            // Payment amount
            $table->decimal('amount', 10, 2);

            // Payment gateway
            $table->string('gateway')->nullable();

            // Gateway order/payment identifiers
            $table->string('order_id')->nullable()->unique();
            $table->string('payment_id')->nullable()->unique();

            // Payment status
            $table->enum('status', [
                'created',
                'pending',
                'paid',
                'failed',
                'refunded'
            ])->default('created');

            // When payment was successfully completed
            $table->timestamp('paid_at')->nullable();

            // Gateway response/reference information
            $table->text('remarks')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};