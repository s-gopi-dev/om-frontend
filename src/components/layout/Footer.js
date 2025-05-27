const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6">
      <div className="container mx-auto px-6 text-center text-gray-600">
        <p>CreativeBlog © {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;