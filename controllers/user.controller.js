const { query, getDocs, where, updateDoc, addDoc, doc, orderBy, limit, getDoc } = require("firebase/firestore");
const { uploadBytes, getDownloadURL } = require('firebase/storage')
const { userCollection, db, dataCollection, posterImageRef, videoRef } = require("../configs/db-config");
const { getCurrentSeconds } = require('../utilities/index')

exports.connectWallet = async (req, res) => {
    try {
        const { address } = req.body;

        const user = await addDoc(userCollection, {
            address: address,
            plan: 3,
            video_count: 0,
            purchased_videos: [],
            rate: 0
        })

        if (user) {
            return res.status(200).send({
                id: user.id
            })
        }
    } catch (err) {
        console.log(err);
    }
}

exports.upgradeUserPlan = async (req, res) => {
    try {
        const { id, plan } = req.body;
        const userDoc = doc(db, "user_info", id);
        await updateDoc(userDoc, {
            "plan": plan
        }).then(() => {
            return res.status(200).send({
                updated: true
            })
        }).catch((err) => {
            console.log(err);
        });
    } catch (err) {
        console.log(err);
    }
}

exports.purchaseNewVideo = async (req, res) => {
    try {
        const { id, olddata, newItem } = req.body;

        const userRef = doc(db, "user_info", id);
        const tempArray = [...olddata];
        tempArray.push(newItem);

        updateDoc(userRef, {
            "purchased_videos": tempArray
        }).then(() => {
            return res.status(200).send({
                purchased: true
            })
        }).catch((err) => {
            console.log(err);
        });
    } catch (err) {
        console.log(err);
    }
}


exports.uploadData = async (req, res) => {
    try {
        const { address, title, overview, type, titleKeywords, overviewKeywords, id, count } = req.body;
        const { video, image } = req.files;
        const { mimetype } = video[0];

        const fileId = address + getCurrentSeconds();

        let totalQuery = query(dataCollection, orderBy("createdAt","desc"), limit(1));
        const querySnapshot = await getDocs(totalQuery);
        let tempData = [];
        querySnapshot.forEach((doc) => {
            tempData.push({
                id: doc.id,
                data: doc.data()
            });
        });

        let videoId = 0;

        if(tempData[0]) {
            videoId = tempData[0].data.count+1;
        } else {
            videoId = 1;
        }

        const imageUrl = await this.bytesUpload(posterImageRef(fileId), image[0]);
        const videoUrl = await this.bytesUpload(videoRef(fileId), video[0]);
        const streamId = fileId +"." + mimetype.split("/")[1];

        const arrayTitleKeywords = titleKeywords.split(",");
        const arrayOverviewKeywords = overviewKeywords.split(",");

        let uniqueChars = [...new Set(arrayTitleKeywords.concat(arrayOverviewKeywords))];

        if (imageUrl && videoUrl) {

            const addVideoRef = await addDoc(dataCollection, {
                title: title,
                overview: overview,
                type: type,
                posterImage: imageUrl,
                address: address,
                follers: [],
                views: 0,
                keywords: uniqueChars,
                streamId:streamId,
                createdAt:getCurrentSeconds(),
                count:videoId,
                userId:id
            });

            if(type !== "free") {
                const userDoc = doc(db, "user_info", id);
                await updateDoc(userDoc, {
                    "video_count": parseInt(count)
                });
            }

            if (addVideoRef.id) {
                return res.status(200).send({
                    isUploaded: true
                })
            } else {
                return res.status(500).send({
                    isUploaded: false
                })
            }

        } else {
            return res.status(200).send({
                isUploaded: false
            })
        }

    } catch (err) {
        console.log(err);
    }
}

exports.bytesUpload = async (ref, data) => {
    const result = await uploadBytes(ref, data.buffer, data.metatype)
    return getDownloadURL(result.ref);
}

exports.updateViews = async (req, res) => {
    try {
        const { item } = req.body;

        const dataDoc = doc(db, "video_data", item.id);
        updateDoc(dataDoc, {
            "views": item.data.views + 1
        }).then(() => {
            return res.status(200).send({
                isUpdated: true
            })
        }).catch((err) => {
            console.log(err);
        })
    } catch (err) {
        console.log(err);
    }
}


exports.followVideo = async (req, res) => {
    try {
        const { item, id, userId } = req.body;

        const userDoc = doc(db,"user_info", userId);
        const { rate } = (await getDoc(userDoc)).data();

        const videoDoc = doc(db, "video_data", id);

        updateDoc(videoDoc, {
            "follers": item
        }).then(() => {
            updateDoc(userDoc, {
                rate:rate+0.03
            }).then(() => {
                return res.status(200).send({
                    isFollowed: true
                })
            }).catch((err) => {
                console.log(err);
            })
        }).catch((err) => {
            console.log(err);
        })
    } catch (err) {
        console.log(err);
    }
}