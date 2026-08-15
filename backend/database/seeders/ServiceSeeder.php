<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            ['रहिवासी दाखला', 'Residence Certificate', 7, 20],
            ['उत्पन्न दाखला', 'Income Certificate', 10, 30],
            ['जात प्रमाणपत्र', 'Caste Certificate', 15, 50],
            ['जन्म दाखला', 'Birth Certificate', 5, 10],
            ['मृत्यू दाखला', 'Death Certificate', 5, 10],
            ['ना हरकत प्रमाणपत्र', 'NOC Certificate', 7, 25],
            ['विवाह दाखला', 'Marriage Certificate', 7, 20],
            ['वारस दाखला', 'Legal Heir Certificate', 15, 40],
            ['वय प्रमाणपत्र', 'Age Certificate', 5, 15],
            ['चरित्र प्रमाणपत्र', 'Character Certificate', 7, 20],
            ['बांधकाम परवानगी', 'Building Permission', 30, 200],
            ['पाणी जोडणी अर्ज', 'Water Connection', 10, 100],
            ['मालमत्ता कर नोंद', 'Property Tax Registration', 15, 50],
            ['दुकान परवाना', 'Shop License', 20, 150],
            ['जमीन उतारा अर्ज', 'Land Extract Application', 10, 25],
            ['कुटुंब नोंद उतारा', 'Family Register Extract', 5, 15],
            ['गरीबी प्रमाणपत्र', 'Poverty Certificate', 10, 20],
            ['अपंग प्रमाणपत्र अर्ज', 'Disability Certificate', 20, 30],
            ['वृद्धापकाळ योजना अर्ज', 'Old Age Pension Application', 15, 0],
            ['शेतकरी प्रमाणपत्र', 'Farmer Certificate', 10, 20],
        ];

        foreach ($services as $service) {
            Service::create([
                'name_mr' => $service[0],
                'name_en' => $service[1],
                'processing_days' => $service[2],
                'fee' => $service[3],
                'is_active' => true,
            ]);
        }
    }
}