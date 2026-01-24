/* eslint-disable no-undef */
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

// @ts-expect-error - import.meta works with tsx
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OPENAPI_SPEC = path.join(__dirname, "../openapi.json");
const SDKS_DIR = path.join(__dirname, "../sdks");

// SDK configurations for different languages
const SDK_CONFIGS = [
  {
    name: "typescript",
    generator: "typescript-axios",
    outputDir: "typescript",
    additionalProperties: [
      "npmName=@connectedxm/admin-sdk",
      "supportsES6=true",
      "withInterfaces=true",
    ],
  },
  {
    name: "python",
    generator: "python",
    outputDir: "python",
    additionalProperties: [
      "packageName=connectedxm-admin-sdk",
      "projectName=connectedxm-admin-sdk",
    ],
  },
  {
    name: "go",
    generator: "go",
    outputDir: "go",
    additionalProperties: [
      "packageName=connectedxm-admin-sdk",
      "moduleName=github.com/connectedxm/admin-sdk-go",
    ],
  },
  {
    name: "java",
    generator: "java",
    outputDir: "java",
    additionalProperties: [
      "groupId=com.connectedxm",
      "artifactId=admin-sdk",
      "invokerPackage=com.connectedxm.admin-sdk",
      "apiPackage=com.connectedxm.admin-sdk.api",
      "modelPackage=com.connectedxm.admin-sdk.model",
    ],
  },
  {
    name: "csharp",
    generator: "csharp",
    outputDir: "csharp",
    additionalProperties: [
      "packageName=ConnectedXM.AdminSdk",
      "targetFramework=net8.0",
    ],
  },
  {
    name: "ruby",
    generator: "ruby",
    outputDir: "ruby",
    additionalProperties: [
      "gemName=connectedxm-admin-sdk",
      "moduleName=ConnectedXMAdminSdk",
    ],
  },
];

function ensureOpenApiGeneratorInstalled(): boolean {
  try {
    execSync("npx @openapitools/openapi-generator-cli version", {
      stdio: "pipe",
    });
    return true;
  } catch {
    console.log("📦 Installing OpenAPI Generator CLI...");
    try {
      execSync("npm install -g @openapitools/openapi-generator-cli", {
        stdio: "inherit",
      });
      return true;
    } catch {
      console.error("❌ Failed to install OpenAPI Generator CLI");
      return false;
    }
  }
}

function generateSdk(config: (typeof SDK_CONFIGS)[0]): boolean {
  const outputPath = path.join(SDKS_DIR, config.outputDir);

  console.log(`\n🔧 Generating ${config.name} SDK...`);

  // Clean existing output
  if (fs.existsSync(outputPath)) {
    fs.rmSync(outputPath, { recursive: true });
  }

  const additionalProps = config.additionalProperties.join(",");

  const command = [
    "npx @openapitools/openapi-generator-cli generate",
    `-i "${OPENAPI_SPEC}"`,
    `-g ${config.generator}`,
    `-o "${outputPath}"`,
    additionalProps ? `--additional-properties=${additionalProps}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  try {
    execSync(command, { stdio: "pipe" });
    console.log(`✅ ${config.name} SDK generated at ${outputPath}`);

    // Add AdminApi wrapper based on language
    generateAdminApiWrapperForLanguage(config.name, outputPath);

    return true;
  } catch (error) {
    console.error(`❌ Failed to generate ${config.name} SDK`);
    if (error instanceof Error && "stderr" in error) {
      console.error((error as any).stderr?.toString());
    }
    return false;
  }
}

/**
 * Extract API class info from generated files
 */
interface ApiClassInfo {
  className: string;
  propertyName: string; // camelCase for property access
  snakeName: string; // snake_case for Python/Ruby
}

/**
 * Route to the appropriate language wrapper generator
 */
function generateAdminApiWrapperForLanguage(
  language: string,
  outputPath: string
): void {
  switch (language) {
    case "typescript":
      generateTypeScriptWrapper(outputPath);
      break;
    case "python":
      generatePythonWrapper(outputPath);
      break;
    case "go":
      generateGoWrapper(outputPath);
      break;
    case "java":
      generateJavaWrapper(outputPath);
      break;
    case "csharp":
      generateCSharpWrapper(outputPath);
      break;
    case "ruby":
      generateRubyWrapper(outputPath);
      break;
  }
}

/**
 * Convert PascalCase to snake_case
 */
function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "");
}

/**
 * Extract API classes from TypeScript api.ts file
 */
function extractApiClasses(outputPath: string): ApiClassInfo[] {
  const apiFilePath = path.join(outputPath, "api.ts");
  if (!fs.existsSync(apiFilePath)) {
    // Try alternative locations for other languages
    return [];
  }

  const apiContent = fs.readFileSync(apiFilePath, "utf-8");
  const apiClassMatches = apiContent.match(
    /export class (\w+Api) extends BaseAPI/g
  );
  if (!apiClassMatches) return [];

  return apiClassMatches.map((match) => {
    const className = match
      .replace("export class ", "")
      .replace(" extends BaseAPI", "");
    const baseName = className.replace(/Api$/, "");
    const propertyName = baseName.charAt(0).toLowerCase() + baseName.slice(1);
    const snakeName = toSnakeCase(baseName);
    return { className, propertyName, snakeName };
  });
}

/**
 * Generate TypeScript AdminApi wrapper
 */
function generateTypeScriptWrapper(outputPath: string): void {
  const apiClasses = extractApiClasses(outputPath);
  if (apiClasses.length === 0) {
    console.warn("⚠️  Could not find API classes to wrap");
    return;
  }

  const wrapperContent = `/* tslint:disable */
/* eslint-disable */
/**
 * AdminApi - Unified API client wrapper
 * 
 * Usage:
 *   const adminApi = new AdminApi({
 *     basePath: "https://admin-api.connected.dev",
 *     apiKey: "your-api-key",
 *     organizationId: "your-org-id",
 *   });
 *   const accounts = await adminApi.accounts.getAccounts();
 *   const events = await adminApi.events.getEvents();
 */

import { Configuration, ConfigurationParameters } from "./configuration";
import {
${apiClasses.map((c) => `  ${c.className},`).join("\n")}
} from "./api";

export interface AdminApiConfig {
  /** The API base URL (e.g., "https://admin-api.connected.dev") */
  basePath: string;
  /** Your API key for authentication */
  apiKey: string;
  /** Your organization ID */
  organizationId: string;
}

export class AdminApi {
  private readonly config: Configuration;

${apiClasses
  .map((c) => `  public readonly ${c.propertyName}: ${c.className};`)
  .join("\n")}

  constructor(config: AdminApiConfig) {
    this.config = new Configuration({
      basePath: config.basePath,
      baseOptions: {
        headers: {
          "api-key": config.apiKey,
          "organization": config.organizationId,
        },
      },
    });

${apiClasses
  .map((c) => `    this.${c.propertyName} = new ${c.className}(this.config);`)
  .join("\n")}
  }

  /**
   * Update the API key
   */
  setApiKey(apiKey: string): void {
    if (this.config.baseOptions?.headers) {
      this.config.baseOptions.headers["api-key"] = apiKey;
    }
  }

  /**
   * Update the organization ID
   */
  setOrganizationId(organizationId: string): void {
    if (this.config.baseOptions?.headers) {
      this.config.baseOptions.headers["organization"] = organizationId;
    }
  }
}

export default AdminApi;
`;

  fs.writeFileSync(path.join(outputPath, "admin-api.ts"), wrapperContent);

  // Update index.ts
  const indexPath = path.join(outputPath, "index.ts");
  let indexContent = fs.readFileSync(indexPath, "utf-8");
  if (!indexContent.includes("admin-api")) {
    indexContent =
      indexContent.trimEnd() +
      '\nexport * from "./admin-api";\nexport { AdminApi as default } from "./admin-api";\n';
    fs.writeFileSync(indexPath, indexContent);
  }

  console.log("   ✨ Added AdminApi wrapper class");
}

/**
 * Generate Python AdminApi wrapper
 */
function generatePythonWrapper(outputPath: string): void {
  // Find Python API classes - try both naming conventions
  let apiDir = path.join(outputPath, "connectedxm_admin_sdk", "api");
  let packageDir = path.join(outputPath, "connectedxm_admin_sdk");
  let packageImportName = "connectedxm_admin_sdk";

  if (!fs.existsSync(apiDir)) {
    // Try hyphenated package name
    apiDir = path.join(outputPath, "connectedxm-admin-sdk", "api");
    packageDir = path.join(outputPath, "connectedxm-admin-sdk");
    // Python imports still use underscores even if folder has hyphens
    packageImportName = "connectedxm_admin_sdk";
    if (!fs.existsSync(apiDir)) {
      console.warn("⚠️  Could not find Python API directory");
      return;
    }
  }

  const files = fs
    .readdirSync(apiDir)
    .filter((f) => f.endsWith("_api.py") && f !== "__init__.py");
  const apiClasses = files.map((f) => {
    const snakeName = f.replace("_api.py", "");
    const className =
      snakeName
        .split("_")
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join("") + "Api";
    return { className, snakeName, moduleName: f.replace(".py", "") };
  });

  if (apiClasses.length === 0) {
    console.warn("⚠️  Could not find Python API classes");
    return;
  }

  const wrapperContent = `# coding: utf-8
"""
AdminApi - Unified API client wrapper

Usage:
    from ${packageImportName} import AdminApi
    
    api = AdminApi(
        base_url="https://admin-api.connected.dev",
        api_key="your-api-key",
        organization_id="your-org-id",
    )
    accounts = api.accounts.get_accounts()
    events = api.events.get_events()
"""

from ${packageImportName}.api_client import ApiClient
from ${packageImportName}.configuration import Configuration
${apiClasses
  .map(
    (c) => `from ${packageImportName}.api.${c.moduleName} import ${c.className}`
  )
  .join("\n")}


class AdminApi:
    """Unified API client with namespaced resources."""

    def __init__(
        self,
        base_url: str,
        api_key: str,
        organization_id: str,
    ):
        """
        Initialize the AdminApi client.

        Args:
            base_url: The API base URL (e.g., "https://admin-api.connected.dev")
            api_key: Your API key for authentication
            organization_id: Your organization ID
        """
        self._configuration = Configuration()
        self._configuration.host = base_url
        
        self._api_client = ApiClient(self._configuration)
        self._api_client.default_headers["api-key"] = api_key
        self._api_client.default_headers["organization"] = organization_id

${apiClasses
  .map((c) => `        self.${c.snakeName} = ${c.className}(self._api_client)`)
  .join("\n")}

    def set_api_key(self, api_key: str):
        """Update the API key."""
        self._api_client.default_headers["api-key"] = api_key

    def set_organization_id(self, organization_id: str):
        """Update the organization ID."""
        self._api_client.default_headers["organization"] = organization_id
`;

  fs.writeFileSync(path.join(packageDir, "admin_api.py"), wrapperContent);

  // Update __init__.py to export AdminApi
  const initPath = path.join(packageDir, "__init__.py");
  let initContent = fs.readFileSync(initPath, "utf-8");
  if (!initContent.includes("AdminApi")) {
    initContent =
      initContent.trimEnd() +
      `\nfrom ${packageImportName}.admin_api import AdminApi\n`;
    fs.writeFileSync(initPath, initContent);
  }

  console.log("   ✨ Added AdminApi wrapper class");
}

/**
 * Generate Go AdminApi wrapper
 */
function generateGoWrapper(outputPath: string): void {
  // Find Go API files
  const files = fs
    .readdirSync(outputPath)
    .filter((f) => f.startsWith("api_") && f.endsWith(".go"));
  const apiClasses = files.map((f) => {
    const snakeName = f.replace("api_", "").replace(".go", "");
    const pascalName = snakeName
      .split("_")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join("");
    return {
      serviceName: pascalName + "Service",
      fieldName: pascalName,
      apiName: "Api" + pascalName + "Service",
    };
  });

  if (apiClasses.length === 0) {
    console.warn("⚠️  Could not find Go API files");
    return;
  }

  const wrapperContent = `/*
AdminApi - Unified API client wrapper

Usage:

    api := connectedxm.NewAdminApi("https://admin-api.connected.dev", "your-api-key", "your-org-id")
    accounts, _, err := api.Accounts.GetAccounts(context.Background()).Execute()
    events, _, err := api.Events.GetEvents(context.Background()).Execute()
*/
package connectedxm

import (
\t"context"
)

// AdminApi provides a unified interface to all API resources
type AdminApi struct {
\tclient *APIClient
${apiClasses.map((c) => `\t${c.fieldName} *${c.apiName}`).join("\n")}
}

// NewAdminApi creates a new AdminApi client
// basePath: The API base URL (e.g., "https://admin-api.connected.dev")
// apiKey: Your API key for authentication
// organizationId: Your organization ID
func NewAdminApi(basePath string, apiKey string, organizationId string) *AdminApi {
\tcfg := NewConfiguration()
\tcfg.Servers = ServerConfigurations{
\t\t{URL: basePath},
\t}
\tcfg.AddDefaultHeader("api-key", apiKey)
\tcfg.AddDefaultHeader("organization", organizationId)

\tclient := NewAPIClient(cfg)
\treturn &AdminApi{
\t\tclient: client,
${apiClasses.map((c) => `\t\t${c.fieldName}: client.${c.apiName},`).join("\n")}
\t}
}

// NewAdminApiWithConfig creates a new AdminApi client with custom configuration
func NewAdminApiWithConfig(cfg *Configuration) *AdminApi {
\tclient := NewAPIClient(cfg)
\treturn &AdminApi{
\t\tclient: client,
${apiClasses.map((c) => `\t\t${c.fieldName}: client.${c.apiName},`).join("\n")}
\t}
}

// SetApiKey updates the API key
func (a *AdminApi) SetApiKey(apiKey string) {
\ta.client.cfg.AddDefaultHeader("api-key", apiKey)
}

// SetOrganizationId updates the organization ID
func (a *AdminApi) SetOrganizationId(organizationId string) {
\ta.client.cfg.AddDefaultHeader("organization", organizationId)
}

// WithContext returns a context for API calls
func (a *AdminApi) WithContext() context.Context {
\treturn context.Background()
}
`;

  fs.writeFileSync(path.join(outputPath, "admin_api.go"), wrapperContent);
  console.log("   ✨ Added AdminApi wrapper class");
}

/**
 * Generate Java AdminApi wrapper
 */
function generateJavaWrapper(outputPath: string): void {
  // Try different path patterns that openapi-generator might use
  const pathPatterns = [
    {
      dir: "src/main/java/com/connectedxm/admin_sdk/api",
      pkg: "com.connectedxm.admin_sdk",
    },
    {
      dir: "src/main/java/com/connectedxm/adminsdk/api",
      pkg: "com.connectedxm.adminsdk",
    },
    {
      dir: "src/main/java/com/connectedxm/admin-sdk/api",
      pkg: "com.connectedxm.adminsdk",
    },
  ];

  for (const pattern of pathPatterns) {
    const apiDir = path.join(outputPath, pattern.dir);
    if (fs.existsSync(apiDir)) {
      generateJavaWrapperInDir(outputPath, apiDir, pattern.pkg);
      return;
    }
  }

  console.warn("⚠️  Could not find Java API directory");
}

function generateJavaWrapperInDir(
  outputPath: string,
  apiDir: string,
  packageName: string
): void {
  const files = fs.readdirSync(apiDir).filter((f) => f.endsWith("Api.java"));
  const apiClasses = files.map((f) => {
    const className = f.replace(".java", "");
    const fieldName = className.charAt(0).toLowerCase() + className.slice(1);
    return { className, fieldName };
  });

  if (apiClasses.length === 0) {
    console.warn("⚠️  Could not find Java API classes");
    return;
  }

  // const packagePath = packageName.replace(/\\./g, "/");
  const wrapperContent = `package ${packageName}.api;

import ${packageName}.ApiClient;
${apiClasses.map((c) => `import ${packageName}.api.${c.className};`).join("\n")}

/**
 * AdminApi - Unified API client wrapper
 * <p>
 * Usage:
 * <pre>
 * AdminApi api = new AdminApi("https://admin-api.connected.dev", "your-api-key", "your-org-id");
 * List&lt;Account&gt; accounts = api.accounts().getAccounts();
 * List&lt;Event&gt; events = api.events().getEvents();
 * </pre>
 */
public class AdminApi {
    private final ApiClient apiClient;
${apiClasses
  .map((c) => `    private final ${c.className} ${c.fieldName};`)
  .join("\n")}

    /**
     * Create a new AdminApi client.
     *
     * @param basePath The API base URL (e.g., "https://admin-api.connected.dev")
     * @param apiKey Your API key for authentication
     * @param organizationId Your organization ID
     */
    public AdminApi(String basePath, String apiKey, String organizationId) {
        this.apiClient = new ApiClient();
        this.apiClient.setBasePath(basePath);
        this.apiClient.addDefaultHeader("api-key", apiKey);
        this.apiClient.addDefaultHeader("organization", organizationId);

${apiClasses
  .map(
    (c) => `        this.${c.fieldName} = new ${c.className}(this.apiClient);`
  )
  .join("\n")}
    }

    /**
     * Create a new AdminApi client with a custom ApiClient.
     *
     * @param apiClient The pre-configured ApiClient
     */
    public AdminApi(ApiClient apiClient) {
        this.apiClient = apiClient;
${apiClasses
  .map(
    (c) => `        this.${c.fieldName} = new ${c.className}(this.apiClient);`
  )
  .join("\n")}
    }

${apiClasses
  .map(
    (c) =>
      `    public ${c.className} ${c.fieldName}() { return this.${c.fieldName}; }`
  )
  .join("\n")}

    /**
     * Update the API key.
     *
     * @param apiKey The new API key
     */
    public void setApiKey(String apiKey) {
        this.apiClient.addDefaultHeader("api-key", apiKey);
    }

    /**
     * Update the organization ID.
     *
     * @param organizationId The new organization ID
     */
    public void setOrganizationId(String organizationId) {
        this.apiClient.addDefaultHeader("organization", organizationId);
    }

    /**
     * Get the underlying ApiClient.
     *
     * @return The ApiClient instance
     */
    public ApiClient getApiClient() {
        return this.apiClient;
    }
}
`;

  fs.writeFileSync(path.join(apiDir, "AdminApi.java"), wrapperContent);
  console.log("   ✨ Added AdminApi wrapper class");
}

/**
 * Generate C# AdminApi wrapper
 */
function generateCSharpWrapper(outputPath: string): void {
  const apiDir = path.join(outputPath, "src/ConnectedXM.AdminSdk/Api");
  if (!fs.existsSync(apiDir)) {
    console.warn("⚠️  Could not find C# API directory");
    return;
  }

  const files = fs
    .readdirSync(apiDir)
    .filter((f) => f.endsWith("Api.cs") && f !== "AdminApi.cs");
  const apiClasses = files.map((f) => {
    const className = f.replace(".cs", "");
    const propertyName = className.replace(/Api$/, "");
    return { className, propertyName };
  });

  if (apiClasses.length === 0) {
    console.warn("⚠️  Could not find C# API classes");
    return;
  }

  const wrapperContent = `using System;
using System.Collections.Generic;
using ConnectedXM.AdminSdk.Client;

namespace ConnectedXM.AdminSdk.Api
{
    /// <summary>
    /// AdminApi - Unified API client wrapper
    /// </summary>
    /// <example>
    /// <code>
    /// var api = new AdminApi("https://admin-api.connected.dev", "your-api-key", "your-org-id");
    /// var accounts = await api.Accounts.GetAccountsAsync();
    /// var events = await api.Events.GetEventsAsync();
    /// </code>
    /// </example>
    public class AdminApi
    {
        private readonly Configuration _configuration;

${apiClasses
  .map(
    (c) =>
      `        /// <summary>${c.propertyName} API endpoints</summary>\n        public ${c.className} ${c.propertyName} { get; }`
  )
  .join("\n\n")}

        /// <summary>
        /// Create a new AdminApi client.
        /// </summary>
        /// <param name="basePath">The API base URL (e.g., "https://admin-api.connected.dev")</param>
        /// <param name="apiKey">Your API key for authentication</param>
        /// <param name="organizationId">Your organization ID</param>
        public AdminApi(string basePath, string apiKey, string organizationId)
        {
            _configuration = new Configuration
            {
                BasePath = basePath,
                DefaultHeaders = new Dictionary<string, string>
                {
                    { "api-key", apiKey },
                    { "organization", organizationId }
                }
            };

${apiClasses
  .map(
    (c) => `            ${c.propertyName} = new ${c.className}(_configuration);`
  )
  .join("\n")}
        }

        /// <summary>
        /// Create a new AdminApi client with custom configuration.
        /// </summary>
        /// <param name="configuration">The pre-configured Configuration object</param>
        public AdminApi(Configuration configuration)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
${apiClasses
  .map(
    (c) => `            ${c.propertyName} = new ${c.className}(_configuration);`
  )
  .join("\n")}
        }

        /// <summary>
        /// Update the API key.
        /// </summary>
        /// <param name="apiKey">The new API key</param>
        public void SetApiKey(string apiKey)
        {
            _configuration.DefaultHeaders["api-key"] = apiKey;
        }

        /// <summary>
        /// Update the organization ID.
        /// </summary>
        /// <param name="organizationId">The new organization ID</param>
        public void SetOrganizationId(string organizationId)
        {
            _configuration.DefaultHeaders["organization"] = organizationId;
        }
    }
}
`;

  fs.writeFileSync(path.join(apiDir, "AdminApi.cs"), wrapperContent);
  console.log("   ✨ Added AdminApi wrapper class");
}

/**
 * Generate Ruby AdminApi wrapper
 */
function generateRubyWrapper(outputPath: string): void {
  const apiDir = path.join(outputPath, "lib/connectedxm-admin-sdk/api");
  if (!fs.existsSync(apiDir)) {
    console.warn("⚠️  Could not find Ruby API directory");
    return;
  }

  const files = fs.readdirSync(apiDir).filter((f) => f.endsWith("_api.rb"));
  const apiClasses = files.map((f) => {
    const snakeName = f.replace("_api.rb", "");
    const className =
      snakeName
        .split("_")
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join("") + "Api";
    return { className, snakeName };
  });

  if (apiClasses.length === 0) {
    console.warn("⚠️  Could not find Ruby API classes");
    return;
  }

  const wrapperContent = `# AdminApi - Unified API client wrapper
#
# Usage:
#   api = ConnectedXMAdminSdk::AdminApi.new(
#     base_url: "https://admin-api.connected.dev",
#     api_key: "your-api-key",
#     organization_id: "your-org-id"
#   )
#   accounts = api.accounts.get_accounts
#   events = api.events.get_events

module ConnectedXMAdminSdk
  class AdminApi
${apiClasses
  .map(
    (c) =>
      `    # @return [${c.className}] ${c.snakeName} API endpoints\n    attr_reader :${c.snakeName}`
  )
  .join("\n\n")}

    # Create a new AdminApi client.
    #
    # @param base_url [String] The API base URL (e.g., "https://admin-api.connected.dev")
    # @param api_key [String] Your API key for authentication
    # @param organization_id [String] Your organization ID
    def initialize(base_url:, api_key:, organization_id:)
      @config = Configuration.new
      @config.host = base_url
      @api_client = ApiClient.new(@config)
      @api_client.default_headers["api-key"] = api_key
      @api_client.default_headers["organization"] = organization_id

${apiClasses
  .map((c) => `      @${c.snakeName} = ${c.className}.new(@api_client)`)
  .join("\n")}
    end

    # Update the API key.
    #
    # @param api_key [String] The new API key
    def set_api_key(api_key)
      @api_client.default_headers["api-key"] = api_key
    end

    # Update the organization ID.
    #
    # @param organization_id [String] The new organization ID
    def set_organization_id(organization_id)
      @api_client.default_headers["organization"] = organization_id
    end
  end
end
`;

  fs.writeFileSync(path.join(apiDir, "admin_api.rb"), wrapperContent);

  // Update the main module file to require admin_api
  const libDir = path.join(outputPath, "lib");
  const mainFile = path.join(libDir, "connectedxm-admin-sdk.rb");
  if (fs.existsSync(mainFile)) {
    let mainContent = fs.readFileSync(mainFile, "utf-8");
    if (!mainContent.includes("admin_api")) {
      mainContent =
        mainContent.trimEnd() +
        "\nrequire 'connectedxm-admin-sdk/api/admin_api'\n";
      fs.writeFileSync(mainFile, mainContent);
    }
  }

  console.log("   ✨ Added AdminApi wrapper class");
}

async function main() {
  console.log("🚀 Starting SDK generation...\n");

  // Check if openapi.json exists
  if (!fs.existsSync(OPENAPI_SPEC)) {
    console.error("❌ openapi.json not found. Run 'npm run generate' first.");
    process.exit(1);
  }

  // Ensure output directory exists
  if (!fs.existsSync(SDKS_DIR)) {
    fs.mkdirSync(SDKS_DIR, { recursive: true });
  }

  // Check/install OpenAPI Generator
  if (!ensureOpenApiGeneratorInstalled()) {
    process.exit(1);
  }

  // Generate SDKs
  const results: { name: string; success: boolean }[] = [];

  for (const config of SDK_CONFIGS) {
    const success = generateSdk(config);
    results.push({ name: config.name, success });
  }

  // Summary
  console.log("\n📊 Generation Summary:");
  console.log("─".repeat(40));

  for (const result of results) {
    const icon = result.success ? "✅" : "❌";
    console.log(`${icon} ${result.name}`);
  }

  const successCount = results.filter((r) => r.success).length;
  console.log(
    `\n${successCount}/${results.length} SDKs generated successfully`
  );

  if (successCount < results.length) {
    process.exit(1);
  }
}

main();
