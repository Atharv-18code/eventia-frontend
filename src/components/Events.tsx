import {Card, CardContent} from './ui/card';
import publicEvent from '../assets/public_event.svg';
import privateEvent from '../assets/private_event.svg';
import {Link} from 'react-router-dom';

const Events = () => {
  return (
    <section
      id='events'
      className='min-h-[calc(100vh-64px)] flex flex-col gap-16 p-14 justify-center items-center'
    >
      <h2 className='text-6xl font-black text-primary'>Events</h2>
      <div className='grid grid-cols-2 gap-20'>
        <Link to={'/events'}>
          <Card className='bg-accent w-[350px]'>
            <CardContent className='p-10'>
              <div className='flex flex-col gap-8 items-center'>
                <img
                  src={publicEvent}
                  className='rounded-md object-cover aspect-[6/4] w-96'
                />
                <h3 className='text-xl font-extrabold text-card-foreground'>
                  Public Events
                </h3>
                <p className='text-dark text-center'>
                  Book tickets for exciting public events happening near you.
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Card className='bg-accent w-[350px]'>
          <CardContent className='p-10'>
            <div className='flex flex-col gap-8 items-center'>
              <img
                src={privateEvent}
                className='rounded-md object-cover aspect-[6/4] w-96'
              />
              <h3 className='text-xl font-extrabold text-card-foreground'>
                Private Events
              </h3>
              <p className='text-dark text-center'>
                Host your private gatherings with ease and enjoy exclusive
                venues and services.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Events;
