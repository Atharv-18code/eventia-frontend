import {Card, CardContent} from './ui/card';
import catering from '../assets/catering.svg';
import orchestra from '../assets/orchestra.svg';
import decoration from '../assets/decoration.svg';

const Services = () => {
  return (
    <section
      id='services'
      className='min-h-[calc(100vh-64px)] bg-primary flex flex-col items-center justify-center gap-16 p-14'
    >
      <h2 className='text-6xl font-black text-primary-foreground'>Services</h2>
      <div className='grid grid-cols-3 gap-16'>
        <Card className='bg-accent w-full'>
          <CardContent className='p-10'>
            <div className='flex flex-col gap-8 items-center'>
              <img
                src={catering}
                className='rounded-md object-cover aspect-[6/4] w-96'
              />
              <h3 className='text-xl font-extrabold text-card-foreground'>
                Catering
              </h3>
              <p className='text-dark text-center'>
                Delicious menus customized for your event.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className='bg-accent w-full'>
          <CardContent className='p-10'>
            <div className='flex flex-col gap-8 items-center'>
              <img
                src={orchestra}
                className='rounded-md object-cover aspect-[6/4] w-96'
              />
              <h3 className='text-xl font-extrabold text-card-foreground'>
                Orchestra
              </h3>
              <p className='text-dark text-center'>
                Live music to make your events unforgettable.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className='bg-accent w-full'>
          <CardContent className='p-10'>
            <div className='flex flex-col gap-8 items-center'>
              <img
                src={decoration}
                className='rounded-md object-cover aspect-[6/4] w-96'
              />
              <h3 className='text-xl font-extrabold text-card-foreground'>
                Decoration
              </h3>
              <p className='text-dark text-center'>
                Elegant decorations tailored to your theme.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Services;
