import React from 'react'
import ErrorPage from './Components/ErrorPage';


function Index() {
  return (
    <div>
      <ErrorPage />
    </div>
  )
}

export default Index;
Index.getLayout = function (page) {
  return <>{page}</>;
};
