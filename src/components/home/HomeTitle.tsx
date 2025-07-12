import { HOME_TITLE } from '../common/pageTitleData';

export const HomeTitle = () => {
  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-2xl md:text-3xl font-extrabold mb-2'>{HOME_TITLE.title}</h1>
      <h2 className='text-xl md:text-2xl text-accent-foreground'>{HOME_TITLE.subtitle}</h2>
    </div>
  );
};
