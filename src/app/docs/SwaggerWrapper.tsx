/**
 * SwaggerWrapper component for API documentation
 * Wraps Swagger UI with custom styling and client-side rendering
 */

'use client';
import 'swagger-ui-react/swagger-ui.css';
import dynamic from 'next/dynamic';
import styles from './SwaggerWrapper.module.css';

/**
 * Dynamically import Swagger UI component with client-side rendering
 */
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

/**
 * Renders Swagger UI with custom styling and configuration
 * @param spec OpenAPI/Swagger specification object
 */
export default function SwaggerWrapper({ spec }: { spec: object }) {
  return (
    <div className={styles.swaggerWrapper}>
      <SwaggerUI spec={spec} />
    </div>
  );
}
