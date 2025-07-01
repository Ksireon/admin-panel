import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://cvlwn:22377322@cluster0.1qwsr0h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

export async function GET() {
  try {
    await client.connect();
    const database = client.db('test');
    
    // Fetch data from different collections
    const openLessonCollection = database.collection('openlessons');
    const schoolInfoCollection = database.collection('otkritiyuroks');
    const schoolTourCollection = database.collection('turs');
    const reviewsCollection = database.collection('reviews');
    
    const [openlessons, otkritiyuroks, turs, reviews] = await Promise.all([
      openLessonCollection.find({}).sort({ date: -1 }).toArray(),
      schoolInfoCollection.find({}).sort({ date: -1 }).toArray(),
      schoolTourCollection.find({}).sort({ date: -1 }).toArray(),
      reviewsCollection.find({}).sort({ date: -1 }).toArray()
    ]);
    
    return Response.json({
      success: true,
      data: {
        openlessons,
        otkritiyuroks,
        turs,
        reviews
      }
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch data from database' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}