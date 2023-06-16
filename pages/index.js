import MeetupList from '@/components/meetups/MeetupList';
import NewMeetupForm from '@/components/meetups/NewMeetupForm';
import { MongoClient } from 'mongodb';
import React from 'react';

// const DUMMY_MEETUPS = [
//     {
//         id: 'm1',
//         title: 'A First Meetup',
//         image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg',
//         address: 'Some address 5, 12345 Some City',
//         description: 'This is my first meetup!',
//     },
//     {
//         id: 'm2',
//         title: 'A Second Meetup',
//         image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg',
//         address: 'Some address 10, 12345 Some City',
//         description: 'This is a second meetup!',
//     },
// ];

const HomePage = (props) => {
    // console.log(props);
    return <MeetupList meetups={props.meetups} />;
};

// export async function getServerSideProps(context) {
//     const req = context.req;
//     const res = context.res;
//     console.log('Server Side Render on runtime every time client requests, req.url, res.headers);
//     return {
//         props: {
//             meetups: DUMMY_MEETUPS,
//         },
//     };
// }

export async function getStaticProps(context) {
    // fetch data from API
    // context has { locales: undefined, locale: undefined, defaultLocale: undefined }
    console.log(
        '[{HomePage} SSG Render with Revalidate set to 10 seconds',
        context
    );

    const client = await MongoClient.connect(
        'mongodb+srv://princenawaz007:mongodb@cluster0.g3okyxi.mongodb.net/meetups?retryWrites=true&w=majority'
    );

    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const meetups = await meetupsCollection.find().toArray();
    // console.log(meetups);
    client.close();

    return {
        props: {
            meetups: meetups.map((meetup) => {
                return {
                    title: meetup.title,
                    image: meetup.image,
                    description: meetup.description,
                    id: meetup._id.toString(),
                };
            }),
        },
        revalidate: 10,
    };
}

export default HomePage;
