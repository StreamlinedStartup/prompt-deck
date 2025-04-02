/**
 * Extracts variable names from a string using the {{variable_name}} format.
 * @param text The string containing potential variables.
 * @returns An array of unique variable names found (without the curly braces).
 */
export const extractVariables = (text: string): string[] => {
  if (!text) return [];
  const regex = /\{\{(.*?)\}\}/g;
  const matches = text.match(regex);
  if (!matches) return [];

  // Extract the name inside braces and ensure uniqueness
  const variables = matches.map(match => match.substring(2, match.length - 2).trim());
  return [...new Set(variables)]; // Return unique variable names
};

/**
 * Substitutes variables in a template string with provided values.
 * @param template The template string with {{variable_name}} placeholders.
 * @param values An object where keys are variable names and values are their replacements.
 * @returns The string with variables substituted.
 */
export const substituteVariables = (template: string, values: Record<string, string>): string => {
  if (!template) return '';
  let result = template;
  for (const variable in values) {
    // Use a regex for global replacement to handle multiple occurrences
    const regex = new RegExp(`\\{\\{${variable}\\}\\}`, 'g');
    result = result.replace(regex, values[variable] || ''); // Replace with value or empty string if undefined
  }
  return result;
};