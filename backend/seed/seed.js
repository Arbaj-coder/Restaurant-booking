import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Restaurant from '../models/restaurant.model.js';


dotenv.config();


const dummy = [
{
id: 552524,
title: 'TAJ HOTEL',
overview: 'Taj Hotels is a prestigious hospitality brand...',
poster_path: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjc2_DsIlz0ugHZNBvvvyEW0wcYfprjwPboA&s',
cuisines: [{ name: 'Indian' }, { name: 'Italian' }, { name: 'Chinese' }],
favFoods: [
{ name: 'Masala Dosa', profile_path: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPRKGeMstIZbp32iyiVk8FtraGv4UhEoJ1fg&s' },
{ name: 'Chole Bhature', profile_path: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxOYg-4m-OfPgwL1VIFfR4qK5NTWNvUuuJsw&s' }
],
establish_date: '2023-05-17',
tagline: 'Hold on to your coconuts.',
vote_average: 7.117,
vote_count: 27500,
opening_time: '10:00 AM',
closing_time: '11:00 PM',
address: 'Apollo Bandar, Colaba, Mumbai, Maharashtra 400001',
isFavorite: false
},
{
id: 111111,
title: 'PIZZA PARADISE',
overview: 'Popular pizza place with great wood-fired pizzas',
poster_path: '',
cuisines: [{ name: 'Italian' }],
favFoods: [
{ name: 'Margherita', profile_path: '' },
{ name: 'Fritto Misto', profile_path: '' }
],
establish_date: '2022-03-10',
opening_time: '11:00 AM',
closing_time: '11:00 PM',
address: 'Some Street, City',
isFavorite: false
}
];


const seed = async () => {
try {
await connectDB();
await Restaurant.deleteMany({});
await Restaurant.insertMany(dummy);
console.log('Seeded DB with sample restaurants');
process.exit();
} catch (err) {
console.error(err);
process.exit(1);
}
};


seed();