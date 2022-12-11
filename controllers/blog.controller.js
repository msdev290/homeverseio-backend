const { firestore } = require('firebase-admin');
const { doc, updateDoc, where, getDocs, orderBy, query, addDoc } = require('firebase/firestore')
const { db, blogCollection } = require('../configs/db-config');
const { getCurrentSeconds } = require('../utilities');

exports.addBlog = async (req, res) => {
    try{
        const { videoId, address, userAnswer } = req.body;
        
        const addBlogRef = await addDoc(blogCollection, {
            videoId:videoId,
            address:address,
            userAnswer:userAnswer,
            date:getCurrentSeconds()
        });

        if(addBlogRef.id) {
            res.status(200).send({
                blogId:addBlogRef.id
            })
        } else {
            res.status(500).send("Operation is failed");
        }
    } catch (err) {
        console.log(err);
    }
}

exports.getVideoBlogs = async (req, res) => {
    try{
        const { id } = req.body;

        console.log(id);

        let totalQuery = query(blogCollection, where("videoId","==", id), orderBy('date'));
        const querySnapshot = await getDocs(totalQuery);
        let tempData = [];
        querySnapshot.forEach((doc) => {
            tempData.push({
                id: doc.id,
                data: doc.data()
            });
        });

        return res.status(200).send({
            results: tempData
        })

    } catch(err) {
        console.log(err);
    }
}