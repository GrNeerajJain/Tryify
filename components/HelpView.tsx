import React from 'react';
import { UploadIcon, ImageIcon, SettingsIcon, CheckCircleIcon, QuestionMarkCircleIcon } from './icons';

const GuideSection: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode; }> = ({ title, children, icon }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full p-2">
                {icon}
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
        </div>
        <div className="space-y-3 text-gray-600 dark:text-gray-300">
            {children}
        </div>
    </div>
);

const Tip: React.FC<{ children: React.ReactNode; }> = ({ children }) => (
    <div className="flex items-start gap-3">
        <CheckCircleIcon className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
        <p>{children}</p>
    </div>
);

export const HelpView: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-4xl font-black text-center text-gray-800 dark:text-gray-100 mb-8">How to Use Tryify</h1>

      <div className="space-y-8">
        <GuideSection title="How It Works: 3 Easy Steps" icon={<UploadIcon className="h-6 w-6"/>}>
          <p><strong>1. Upload Your Photo:</strong> Start by uploading a clear, well-lit photo of a person. For best results, use a high-quality image where the person's body and pose are clearly visible.</p>
          <p><strong>2. Provide an Outfit:</strong> You have two options:</p>
          <ul className="list-disc list-inside pl-4 space-y-1">
              <li><strong>Upload an Outfit Image:</strong> Provide a reference photo of an outfit. The AI will try to match its style, color, and texture.</li>
              <li><strong>Describe the Outfit:</strong> Use the text box to describe the outfit you want to see. Be as specific as you like! For example, "a red silk evening gown" or "a casual denim jacket with a white t-shirt".</li>
          </ul>
           <p><strong>3. Generate:</strong> Adjust the aspect ratio if needed, then hit the "Generate Outfit" button. The AI will get to work, and your new image will appear in the result panel.</p>
        </GuideSection>

        <GuideSection title="Tips for Best Results" icon={<SettingsIcon className="h-6 w-6"/>}>
            <Tip>
                <strong>Use high-quality photos.</strong> Clear, well-lit images of the person and the reference outfit will produce much better and more realistic results. Avoid blurry or dark photos.
            </Tip>
            <Tip>
                <strong>Be descriptive.</strong> When writing a prompt, include details about the material, style, color, and fit. For example, instead of "blue shirt," try "a navy blue, slim-fit, long-sleeve cotton shirt."
            </Tip>
             <Tip>
                <strong>Leverage Advanced Settings.</strong> Use the "Fine Details" field to emphasize specific elements. Use the "Negative Prompt" to exclude things you don't want, like "no hats" or "no logos".
            </Tip>
            <Tip>
                <strong>The 'Try Again' button is your friend.</strong> AI generation can have some variance. If you don't love the first result, click "Try Again" to generate a new version with the same settings.
            </Tip>
        </GuideSection>

        <GuideSection title="Frequently Asked Questions" icon={<QuestionMarkCircleIcon className="h-6 w-6"/>}>
            <div>
                <h3 className="font-bold text-gray-700 dark:text-gray-200">How is my data used?</h3>
                <p>Your creations are saved directly on your device in your browser's local storage. They are not uploaded to our servers unless you sign in. Signing in with Google allows you to sync your creations, but your data remains private.</p>
            </div>
             <div>
                <h3 className="font-bold text-gray-700 dark:text-gray-200">Is Tryify free to use?</h3>
                <p>Yes, the app is currently free to use. You can generate outfits without any cost.</p>
            </div>
             <div>
                <h3 className="font-bold text-gray-700 dark:text-gray-200">Where can I see my past creations?</h3>
                <p>All your generated images are saved in the "Creations" tab, accessible from the bottom navigation bar. From there, you can view, download, or share them.</p>
            </div>
        </GuideSection>
      </div>
    </div>
  );
};