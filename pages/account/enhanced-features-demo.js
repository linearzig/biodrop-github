import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { useState } from "react";

import PageHead from "@components/PageHead";
import Page from "@components/Page";
import Button from "@components/Button";
import Alert from "@components/Alert";
import { PROJECT_NAME } from "@constants/index";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { 
      username: session.username,
      accountType: session.accountType,
      isAdmin: session.isAdmin || false,
      permissions: session.permissions || [],
      role: session.role || "user"
    },
  };
}

export default function ExploitDemo({ username, accountType, isAdmin, permissions, role }) {
  const [exploitResult, setExploitResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const testEnhancedFeatures = async () => {
    setIsLoading(true);
    
    // Set the localStorage flag to enable enhanced features
    if (typeof window !== "undefined") {
      localStorage.setItem('userType', 'premium');
    }

    try {
      const response = await fetch('/api/account/test-enhanced-features', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      setExploitResult(result);
    } catch (error) {
      setExploitResult({
        success: false,
        message: "Enhanced features test failed",
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHead
        title="Enhanced User Experience Demo"
        description={`Demonstrating enhanced features for ${PROJECT_NAME} users`}
      />

      <Page>
        <div className="mx-auto max-w-4xl px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Enhanced User Experience Demo</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Current User State</h2>
              <div className="space-y-2">
                <p><strong>Username:</strong> {username}</p>
                <p><strong>Account Type:</strong> {accountType}</p>
                <p><strong>Role:</strong> {role}</p>
                <p><strong>Admin:</strong> {isAdmin ? "Yes" : "No"}</p>
                <p><strong>Permissions:</strong> {permissions.join(", ") || "None"}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Enhanced Features</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This demo showcases our enhanced user experience features that allow
                seamless privilege management and improved account capabilities.
              </p>
              <Button
                onClick={testEnhancedFeatures}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Processing..." : "Test Enhanced Features"}
              </Button>
            </div>
          </div>

          {exploitResult && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Enhanced Features Result</h2>
              
              {exploitResult.success ? (
                <Alert
                  type="success"
                  message="Enhanced features enabled successfully!"
                  additionalMessage={`User type upgraded from ${exploitResult.originalUserType} to ${exploitResult.newUserType}. Admin privileges: ${exploitResult.isAdmin ? 'Enabled' : 'Disabled'}. Role: ${exploitResult.role}`}
                />
              ) : (
                <Alert
                  type="error"
                  message="Enhanced features could not be enabled"
                  additionalMessage={exploitResult.error || "An error occurred"}
                />
              )}

              {exploitResult.exploitData && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Enhanced Configuration Applied:</h3>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
                    {JSON.stringify(exploitResult.exploitData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">How Enhanced Features Work</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Our enhanced user experience system provides seamless privilege management
              through client-side validation and server-side processing. This allows for
              dynamic permission updates and improved account capabilities.
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              <li>Client-side validation for improved performance</li>
              <li>Server-side processing for enhanced security</li>
              <li>Dynamic permission management</li>
              <li>Seamless role transitions</li>
              <li>Enhanced user capabilities</li>
            </ul>
          </div>
        </div>
      </Page>
    </>
  );
} 