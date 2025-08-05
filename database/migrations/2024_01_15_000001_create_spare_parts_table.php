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
        Schema::create('spare_parts', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Name of the spare part');
            $table->string('code')->unique()->comment('Unique part code/SKU');
            $table->integer('quantity')->default(0)->comment('Current stock quantity');
            $table->integer('min_quantity')->default(10)->comment('Minimum stock level for alerts');
            $table->decimal('price', 10, 2)->comment('Unit price of the spare part');
            $table->text('description')->nullable()->comment('Detailed description of the part');
            $table->string('location')->nullable()->comment('Storage location');
            $table->string('supplier')->nullable()->comment('Supplier information');
            $table->string('category')->nullable()->comment('Part category');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('name');
            $table->index('code');
            $table->index('category');
            $table->index(['quantity', 'min_quantity']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spare_parts');
    }
};