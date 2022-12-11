const { collection, query, getDocs, where, addDoc, doc, updateDoc, limit, orderBy } = require('firebase/firestore');
const { msgCollection, db } = require('../configs/db-config');

exports.addTransaction = async (req, res) => {
    try{
        const { item, type, address, dateTime } = req.body;

        let price = "";

        if(item.data.type === "news") {
            price = "0.3";
        }
        if(item.data.type === "business") {
            price = "0.2";
        }
        if(item.data.type === "tech") {
            price = "0.2";
        }
        if(item.data.type === "movie") {
            price = "0.1";
        }
        if(item.data.type === "fun") {
            price = "0.1";
        }
        if(item.data.type === "free") {
            price = "Free";
        }

        const msgRes = await addDoc(msgCollection, {
            title:item.data.title,
            price:price,
            date:dateTime,
            type:type,
            state:0,
            buyer:address,
            owner:item.data.address
        });
        if(msgRes.id) {
            return res.status(200).send({
                isAdded:true
            })
        } else {
            return res.status(200).send({
                isAdded:true
            })
        }
    } catch(err) {
        console.log(err);
    }
}

exports.getUnreadMessages = async (req, res) => {
    try{
        const { address } = req.body;
        const q = query(collection(db, "messages"), where("owner", "==", address), where("state","==", 0));
        const querySnapshot = await getDocs(q);
        let tempData = [];
        querySnapshot.forEach((doc) => {
            tempData.push({
                id:doc.id,
                data:doc.data()
            });
        });
        return res.status(200).send({
            msgs:tempData
        })
    } catch(err) {
        console.log(err);
    }
}

exports.clearMessages = async (req, res) => {
    try{
        const { id } = req.body;
        
        const messageLef = doc(db, "messages", id);
        updateDoc(messageLef, {
            "state":1
        }).then(() => {
            return res.status(200).send({
                isCleard:true
            })
        }).catch((err) => {
            console.log(err);
        })
    } catch (err) {
        console.log(err);
    }
}

exports.getAllMessages = async (req, res) => {
    try{
        const { address } = req.body;
        const q = query(collection(db, "messages"), where("owner", "==", address));
        const querySnapshot = await getDocs(q);
        let tempData = [];
        querySnapshot.forEach((doc) => {
            tempData.push({
                id:doc.id,
                data:doc.data()
            });
        });
        return res.status(200).send({
            allMsgs:tempData
        })
    } catch (err) {
        console.log(err);
    }
}