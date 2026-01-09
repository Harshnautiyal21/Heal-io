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
        Schema::create('diagnoses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->enum('type', ['image', 'symptoms', 'combined']);
            $table->string('disease');
            $table->decimal('confidence', 5, 3);
            $table->string('severity')->nullable();
            $table->text('description')->nullable();
            $table->text('explanation');
            $table->json('recommendations');
            $table->json('alternative_diagnoses')->nullable();
            $table->string('image_path')->nullable();
            $table->string('heatmap_path')->nullable();
            $table->json('symptoms_data')->nullable();
            $table->string('analysis_method')->nullable();
            $table->timestamps();
            
            $table->index(['user_id', 'created_at']);
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('diagnoses');
    }
};
