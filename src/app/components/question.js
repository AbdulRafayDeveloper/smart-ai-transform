'use client';
import React, { useState } from 'react';
import { FAQsData } from '../dataset/data';

const Questions = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(prevIndex => (prevIndex === index ? null : index));
    };

    return (
        <div className="container mx-auto px-4 py-12 ">
            {/* Heading Section */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-foreground">Frequently Asked Questions</h1>
                <p className="text-lg text-gray-600 mt-2">
                    Get answers to common questions about our video & audio transformation services.
                </p>
            </div>

            {/* FAQ Cards */}
            <div className="max-w-4xl mx-auto">
                {FAQsData.map((item, index) => (
                    <div 
                        key={index} 
                        className={`border-b border-gray-300 overflow-hidden ${
                            openIndex === index ? "border-2 border-foreground rounded-md" : ""
                        }`}
                    >
                        {/* Question Section */}
                        <button 
                            onClick={() => toggleAccordion(index)} 
                            className={`flex justify-between items-center w-full text-left p-4 text-lg font-semibold bg-foreground  text-background  transition-all duration-300 rounded-md ${
                                openIndex === index ? "bg-foreground text-white" : ""
                            }`}
                        >
                            <span>{item.question}</span>
                            
                            {/* Right-side + or - Icon */}
                            <span className={`text-2xl transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}>
                                {openIndex === index ? "−" : "+"}
                            </span>
                        </button>

                        {/* Answer Section */}
                        <div 
                            className={`p-4 text-foreground transition-all duration-300 ${
                                openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                            } overflow-hidden`}
                        >
                            {item.answer}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Questions;