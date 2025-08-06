import Footer from "../components/footer";
import Navbar from "../components/navbar";

const Privacy = () => {
    return (
        <>
            <Navbar />
            <div>
                <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-14 mt-14 text-center">
                    <h1 className="text-4xl font-bold">Privacy Policy</h1>
                </section>

                {/* Main Content */}
                <section className="bg-gray-100 py-10">
                    <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 bg-white shadow-2xl rounded-lg overflow-hidden">
                        <div className="p-6">
                            {/* Objective and Scope */}
                            <h2 className="text-3xl font-semibold mb-5 text-blue-600">1. Objective and Scope</h2>
                            <p className="text-gray-700 mb-5">
                                At [Company], we prioritize your privacy and are dedicated to protecting your information. This policy outlines our data collection and usage practices.
                            </p>

                            {/* Acceptance of Terms */}
                            <h2 className="text-3xl font-semibold mb-5 text-blue-600">2. Acceptance of Terms</h2>
                            <p className="text-gray-700 mb-5">
                                By using our website, you agree to this policy. If you do not agree, please refrain from using our services.
                            </p>

                            {/* Collection of Information */}
                            <h2 className="text-3xl font-semibold mb-5 text-blue-600">3. Collection of Information</h2>
                            <ul className="list-disc pl-6 text-gray-700 mb-5">
                                <li>Personal details: Name, email, contact number, etc.</li>
                                <li>Technical details: IP address, browser type, usage data.</li>
                            </ul>

                            {/* Use of Personal Information */}
                            <h2 className="text-3xl font-semibold mb-5 text-blue-600">4. Use of Personal Information</h2>
                            <p className="text-gray-700 mb-5">
                                We utilize collected information to provide services, improve our platform, and enhance user experience.
                            </p>

                            {/* Security */}
                            <h2 className="text-3xl font-semibold mb-5 text-blue-600">5. Security Measures</h2>
                            <p className="text-gray-700 mb-5">
                                We employ robust security protocols to safeguard your data. However, complete security cannot be guaranteed.
                            </p>

                            {/* Amendments */}
                            <h2 className="text-3xl font-semibold mb-5 text-blue-600">6. Policy Updates</h2>
                            <p className="text-gray-700 mb-5">
                                We reserve the right to update this policy. Any changes will be posted on this page.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default Privacy;
