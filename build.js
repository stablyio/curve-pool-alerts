import * as esbuild from "esbuild";

async function build() {
  try {
    // Build the Lambda function
    await esbuild.build({
      entryPoints: ["src/lambda/index.ts"],
      bundle: true,
      outfile: "dist/lambda/index.mjs",
      platform: "node",
      target: "node18",
      format: "esm",
      minify: true,
      sourcemap: true,
    });

    // Build CDK TypeScript files
    await esbuild.build({
      entryPoints: ["bin/app.ts"],
      bundle: true,
      outfile: "dist/bin/app.js",
      platform: "node",
      target: "node18",
      format: "esm",
      external: ["aws-cdk-lib", "constructs"],
      sourcemap: true,
    });

    await esbuild.build({
      entryPoints: ["lib/lambda-stack.ts"],
      bundle: true,
      outfile: "dist/lib/lambda-stack.js",
      platform: "node",
      target: "node18",
      format: "esm",
      external: ["aws-cdk-lib", "constructs"],
      sourcemap: true,
    });

    console.log("Build completed successfully");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

build();
