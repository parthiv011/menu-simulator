import { useRouteError } from 'react-router-dom';
import { LinkButton } from './LinkButton';

function Error() {
  const error = useRouteError() as { message?: string; data?: string };

  return (
    <div>
      <h1>Something went wrong 😢</h1>
      <p>{error.data || error.message || 'Unknown error occurred.'}</p>
      <LinkButton to="-1">&larr; Go back</LinkButton>
    </div>
  );
}

export default Error;
