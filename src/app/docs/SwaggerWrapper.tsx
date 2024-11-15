/**
 * SwaggerWrapper component for API documentation
 * Wraps Swagger UI with custom styling and client-side rendering
 */

'use client'

import dynamic from 'next/dynamic'
import 'swagger-ui-react/swagger-ui.css'

/**
 * Dynamically import Swagger UI component with client-side rendering
 */
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false })

/**
 * Renders Swagger UI with custom styling and configuration
 * @param spec OpenAPI/Swagger specification object
 */
export default function SwaggerWrapper({ spec }: { spec: any }) {
  return (
    <div className="swagger-wrapper">
      <SwaggerUI spec={spec} />
      <style jsx global>{`
        .swagger-ui .info .title small.version-stamp { display: none }
      `}</style>
    </div>
  )
}