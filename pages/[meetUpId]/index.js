import { useRouter } from 'next/router';
import React from 'react';
import MeetupItem from '@/components/meetups/MeetupItem';
import MeetupDetail from '@/components/meetups/MeetupDetail';
import { MongoClient, ObjectId } from 'mongodb';
import Head from 'next/head';

const MeetUpDetailsPage = (props) => {
    const router = useRouter();
    const meetUpId = router.query.meetUpId;
    // console.log(router);
    console.log(props);

    return (
        <>
            <Head>
                <title>{props.meetupData.title}</title>
                <meta
                    name='description'
                    content={props.meetupData.description}
                />
            </Head>
            <MeetupDetail
                image={props.meetupData.image}
                title={props.meetupData.title}
                description={props.meetupData.description}
                address={props.meetupData.address}
            />
        </>
    );
};

export async function getStaticPaths() {
    const client = await MongoClient.connect(
        'mongodb+srv://princenawaz007:mongodb@cluster0.g3okyxi.mongodb.net/meetups?retryWrites=true&w=majority'
    );

    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

    client.close();

    // path below template
    // [
    //         {
    //             params: {
    //                 meetUpId: 'm1',
    //             },
    //         },
    //         {
    //             params: {
    //                 meetUpId: 'm2',
    //             },
    //         },
    //     ]

    return {
        fallback: false, // if true pregenerate missing dynamic params while server gets the request
        paths: meetups.map((meetup) => ({
            params: { meetUpId: meetup._id.toString() },
        })),
    };
}

export async function getStaticProps(context) {
    //fetch data for a single meetup
    // console.log(context);
    // {
    //   params: { meetUpId: 'm2' },
    //   locales: undefined,
    //   locale: undefined,
    //   defaultLocale: undefined
    // }
    const meetUpId = context.params.meetUpId;
    console.log(
        '[{MeetUpDetailsPage} SSG Render with getStaticPaths for [meetUpId]',
        context
    );

    const client = await MongoClient.connect(
        'mongodb+srv://princenawaz007:mongodb@cluster0.g3okyxi.mongodb.net/meetups?retryWrites=true&w=majority'
    );

    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    let selectedMeetup = await meetupsCollection.findOne({
        _id: new ObjectId(meetUpId),
    });

    // console.log(selectedMeetup);
    client.close();
    return {
        props: {
            meetupData: {
                id: selectedMeetup._id.toString(),
                image: selectedMeetup.image,
                title: selectedMeetup.title,
                description: selectedMeetup.description,
                address: selectedMeetup.address,
            },
        },
    };
}

export default MeetUpDetailsPage;
