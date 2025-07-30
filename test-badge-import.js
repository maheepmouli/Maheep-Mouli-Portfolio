// Test to check if Badge component can be imported and used
// Run this in your browser console on the portfolio page

console.log('🧪 TESTING BADGE COMPONENT IMPORT');

// Test 1: Check if there are any import errors
function testImportErrors() {
  console.log('\n1. Checking for import errors...');
  
  console.log('Look for these import-related errors in the console:');
  console.log('- "Cannot resolve module \'@/components/ui/badge\'"');
  console.log('- "Module not found: @/components/ui/badge"');
  console.log('- "Badge is not defined"');
  console.log('- "Cannot resolve Badge"');
  console.log('- "Import error"');
}

// Test 2: Check if the Badge component file exists
function testBadgeFile() {
  console.log('\n2. Checking Badge component file...');
  
  console.log('The Badge component should be located at:');
  console.log('src/components/ui/badge.tsx');
  
  console.log('\nCheck if this file exists and contains:');
  console.log('- import * as React from "react"');
  console.log('- import { cva, type VariantProps } from "class-variance-authority"');
  console.log('- import { cn } from "@/lib/utils"');
  console.log('- export { Badge, badgeVariants }');
}

// Test 3: Check if the utils file exists
function testUtilsFile() {
  console.log('\n3. Checking utils file...');
  
  console.log('The utils file should be located at:');
  console.log('src/lib/utils.ts');
  
  console.log('\nCheck if this file exists and contains:');
  console.log('- import { clsx, type ClassValue } from "clsx"');
  console.log('- import { twMerge } from "tailwind-merge"');
  console.log('- export function cn(...inputs: ClassValue[])');
}

// Test 4: Check if dependencies are installed
function testDependencies() {
  console.log('\n4. Checking dependencies...');
  
  console.log('Check if these dependencies are installed:');
  console.log('- class-variance-authority');
  console.log('- clsx');
  console.log('- tailwind-merge');
  console.log('- lucide-react (for icons)');
}

// Test 5: Check if there are any build errors
function testBuildErrors() {
  console.log('\n5. Checking for build errors...');
  
  console.log('Look for these build-related errors:');
  console.log('- "Compilation error"');
  console.log('- "TypeScript error"');
  console.log('- "Vite error"');
  console.log('- "Bundle error"');
  console.log('- "Module resolution error"');
}

// Test 6: Check if the issue is with the conditional rendering
function testConditionalRendering() {
  console.log('\n6. Testing conditional rendering logic...');
  
  console.log('The current badge rendering logic uses an IIFE (Immediately Invoked Function Expression):');
  console.log('  {(() => {');
  console.log('    console.log(\'Portfolio: Project status:\', project.status, \'Project featured:\', project.featured);');
  console.log('    return (');
  console.log('      <div className="flex flex-wrap gap-2 mb-4">');
  console.log('        {project.status && <Badge>...</Badge>}');
  console.log('        {project.featured && <Badge>...</Badge>}');
  console.log('      </div>');
  console.log('    );');
  console.log('  })()}');
  
  console.log('\nThis might be causing issues. Let\'s try a simpler approach.');
}

// Test 7: Suggest a fix
function suggestFix() {
  console.log('\n7. Suggesting a fix...');
  
  console.log('Try replacing the complex IIFE with simple conditional rendering:');
  console.log('  <div className="flex flex-wrap gap-2 mb-4">');
  console.log('    {project.status && (');
  console.log('      <Badge variant="secondary" className="text-xs">');
  console.log('        {project.status}');
  console.log('      </Badge>');
  console.log('    )}');
  console.log('    {project.featured && (');
  console.log('      <Badge variant="default" className="text-xs">');
  console.log('        Featured');
  console.log('      </Badge>');
  console.log('    )}');
  console.log('  </div>');
}

// Run all tests
function runTests() {
  console.log('🚀 Starting Badge import tests...');
  
  testImportErrors();
  testBadgeFile();
  testUtilsFile();
  testDependencies();
  testBuildErrors();
  testConditionalRendering();
  suggestFix();
  
  console.log('\n✅ Tests complete!');
  console.log('\n📋 Based on the findings:');
  console.log('- No badges are rendering at all');
  console.log('- Manual badge creation works (CSS is fine)');
  console.log('- This suggests a Badge component import/definition issue');
  console.log('\n📋 Most likely issues:');
  console.log('1. Badge component file missing or corrupted');
  console.log('2. Import path issue');
  console.log('3. Dependencies not installed');
  console.log('4. Build/bundle error');
  console.log('5. Complex IIFE causing rendering issues');
}

runTests(); 