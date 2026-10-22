import { Sparkles } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      
      {/* Header */}
      <div className="space-y-3 border-b border-base-border pb-8">
        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-olive-700 block">
          Data Handling & Ethics
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-charcoal-900 leading-tight">
          Demo Privacy Notice
        </h1>
        <p className="text-sm text-charcoal-500">
          Last updated: October 2026 · Interactive Concept Demo crafted by Nats LAB
        </p>
      </div>

      <div className="space-y-8 text-sm text-charcoal-700 leading-relaxed font-sans">
        
        {/* Demo Context */}
        <div className="p-4 bg-wood-50 border border-wood-200 rounded-xl space-y-2">
          <div className="flex items-center space-x-2 text-wood-700 font-semibold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-wood-500" />
            <span>Demonstration Environment</span>
          </div>
          <p className="text-xs text-charcoal-600">
            This website is an interactive sales demonstration developed by <strong>Nats LAB</strong> for <strong>Homeline Interio</strong>. It showcases lead generation, AI design consultation, and administrative CRM capabilities. All sample project items are illustrative.
          </p>
        </div>

        {/* 1. Information Collected */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal-900 font-medium">
            1. Information We Collect
          </h2>
          <p>
            When you submit an enquiry through our consultation form or interact with the AI Design Consultant, we collect only the project-related information you choose to provide:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-charcoal-600">
            <li><strong>Contact Details:</strong> Your full name, mobile phone number, and optional email address.</li>
            <li><strong>Project Scope:</strong> The room or property category (e.g. Modular Kitchens, Full Home Interiors), target Kolkata locality (e.g. Garia, Salt Lake, New Town), and indicative budget range.</li>
            <li><strong>Consultation Brief & Preferences:</strong> Notes on room dimensions, style preferences, or summarized bullet points organized during your conversation with the AI design assistant.</li>
          </ul>
        </section>

        {/* 2. Purpose */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal-900 font-medium">
            2. Purpose of Collection
          </h2>
          <p>
            Your details are captured strictly to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-charcoal-600">
            <li>Review your space requirements prior to scheduling an exploratory consultation.</li>
            <li>Contact you via your chosen communication channel (Phone or WhatsApp).</li>
            <li>Populate the protected administrative dashboard for the Homeline Interio team.</li>
          </ul>
          <p>
            We do not sell, rent, or lease customer contact information to third-party marketing directories.
          </p>
        </section>

        {/* 3. AI & Untrusted Input Safeguards */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal-900 font-medium">
            3. AI Assistant & Responsible Data Use
          </h2>
          <p>
            Our AI design assistant operates with grounded business rules and server-side adapters. It does not inspect other private customer records or access internal administrative secrets. Conversations are summarized into structured project parameters only when you choose to proceed with an enquiry.
          </p>
        </section>

        {/* 4. Security & Storage */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal-900 font-medium">
            4. Security & Retention
          </h2>
          <p>
            Enquiries are stored securely with indexed fields, sanitized inputs, and server-side rate limiting to prevent spam. Access to the lead management dashboard requires authenticated administrator credentials with cryptographic password hashing (bcrypt) and signed JWT tokens.
          </p>
        </section>

        {/* 5. Your Rights */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal-900 font-medium">
            5. Inquiries, Updates & Deletion
          </h2>
          <p>
            If you submit a demo enquiry and wish to have your details updated or expunged from the demonstration database, you may submit a request or notify the demonstration administrator through the contact page.
          </p>
        </section>

      </div>

    </div>
  );
};
