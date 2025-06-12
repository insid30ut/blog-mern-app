import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us', // Will use template from layout: "About Us | Mycelial FunGuy"
  description: 'Learn more about Mycelial FunGuy and our passion for mushroom cultivation.',
};

export default function AboutPage() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8 text-center">
            About Us
          </h1>
          
          <div className="prose lg:prose-lg mx-auto">
            <p>
              Welcome to Mycelial FunGuy! We are passionate about the fascinating world of mycology
              and dedicated to providing accessible, high-quality information and resources for mushroom
              enthusiasts of all levels.
            </p>
            <p>
              Our mission is to demystify the art and science of mushroom cultivation, making it easier for
              hobbyists, aspiring growers, and the simply curious to embark on their own fungal adventures.
              Whether you're interested in gourmet edibles, medicinal mushrooms, or the ecological roles of fungi,
              we aim to be your trusted guide.
            </p>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4">What We Offer</h2>
            <ul>
              <li>
                <strong>Comprehensive Guides:</strong> Our FAQ-style directory covers a wide range of techniques,
                from basic sterilization to advanced cultivation methods. Each guide is crafted to be clear,
                concise, and actionable.
              </li>
              <li>
                <strong>Latest Insights:</strong> Our blog features articles, updates, and musings on various
                topics within the realm of mycology, shared by our admin.
              </li>
              <li>
                <strong>A Growing Community (Implicitly):</strong> While this site is primarily a resource hub,
                we believe in the power of shared knowledge and hope to foster a sense of community among
                growers.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold mt-10 mb-4">Our Philosophy</h2>
            <p>
              We believe that understanding and cultivating mushrooms can be a rewarding experience that connects
              us more deeply with the natural world. We advocate for responsible and sustainable practices.
            </p>
            <p>
              This website is a living project. The information here will be updated and expanded over time.
              Thank you for visiting, and happy growing!
            </p>
            <p className="mt-6">
              <em>(This is placeholder content. Please edit this page with your actual "About Us" information.)</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}