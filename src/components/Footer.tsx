import React from 'react';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex justify-between items-center text-sm text-muted-foreground">
      <div>
        Editor Grok, por Moris Polanco, versión 1.0
      </div>
      <div>
        <a 
          href="https://hostinger.com?REFERRALCODE=6EPMORISPCNQ" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          20% de descuento en los planes y VPS y Cloud de Hostinger
        </a>
      </div>
    </footer>
  );
};

export default Footer;