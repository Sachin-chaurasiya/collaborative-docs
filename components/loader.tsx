import { LoaderIcon } from 'lucide-react';
import React from 'react';

const Loader = () => {
  return (
    <section className="h-screen flex justify-center items-center">
      <LoaderIcon className="w-8 h-8 animate-spin" />
    </section>
  );
};

export default Loader;
