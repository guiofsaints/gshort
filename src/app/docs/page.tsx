/**
 * API Documentation component that renders OpenAPI/Swagger documentation
 * This client-side component integrates the Swagger UI for API exploration
 */

'use client'

import spec from './openapi.json'
import SwaggerWrapper from './SwaggerWrapper'

/**
 * Renders the API documentation page using Swagger UI
 * @returns SwaggerWrapper component with API specification
 */
export default function ApiDocs() {
  return <SwaggerWrapper spec={spec} />
}