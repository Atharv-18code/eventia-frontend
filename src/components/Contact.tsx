const Contact = () => {
  return (
    <section id='contact' className="h-[300px] flex flex-col gap-8 items-center justify-center">
      <h2 className='text-6xl font-black text-primary'>Contact us</h2>
      <p className="text-xl">Have questions or need help? Reach out to us at:</p>
      <ul className="flex gap-8 text-lg">
        <li>Email: <span className="text-dark">support@eventia.com</span></li>
        <li>Phone: <span className="text-dark">+1-234-567-890</span></li>
      </ul>
    </section>
  );
};

export default Contact;
