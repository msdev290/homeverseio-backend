const { collection, query, getDocs, where, addDoc, doc, updateDoc, limit, orderBy, getDoc, startAt } = require("firebase/firestore");
const { dataCollection, db, userCollection } = require('../configs/db-config');
const { getStorage } = require('firebase-admin/storage');
const { firestore } = require("firebase-admin");

exports.getAllTypes = async (req, res) => {
    try {
        const querySnapshot = await getDocs(collection(db, "video_types"));

        let tempData = [];
        querySnapshot.forEach((doc) => {
            tempData.push({
                id: doc.id,
                name: doc.data().name
            });
        });

        return res.status(200).send({
            types: tempData
        })
    } catch (err) {
        console.log(err);
    }
}

exports.getVideoInfo = async (req, res) => {
    try {
        const { id } = req.body;
        await firestore().collection("video_data").doc(id).get().then((snapShot) => {
            const user = {
                id: snapShot.id,
                data: snapShot.data()
            }
            res.status(200).send({
                data: user
            })
        }).catch((err) => {
            console.log(err);
        });

    } catch (err) {
        console.log(err);
    }
}

exports.getAllVideos = async (req, res) => {
    try {
        const { start } = req.body;

        const q = query(dataCollection, orderBy("count"), startAt(start), limit(10));
        const querySnapshot = await getDocs(q);
        let tempData = [];
        querySnapshot.forEach((doc) => {
            tempData.push({
                id: doc.id,
                data: doc.data()
            });
        });

        return res.status(200).send({
            videos: tempData
        })

    } catch (err) {
        console.log(err);
    }
}

exports.searchVideoData = async (req, res) => {
    try {
        const { exploreData, start } = req.body;
        let keywordQuery = limit(10);
        let idQuery = limit(10);
        let addressQuery = limit(10);

        console.log(start);

        if (exploreData.keyword !== "") {
            const keywordArray = exploreData.keyword.split(" ");
            keywordQuery = where("keywords", "array-contains-any", keywordArray);
        }
        if (exploreData.address !== "") {
            addressQuery = where("address", "==", exploreData.address);
        }

        if (exploreData.selectedId !== "") {
            idQuery = where("type", "==", exploreData.selectedId);
        }

        let totalQuery = query(collection(db, "video_data"), keywordQuery, addressQuery, idQuery, orderBy('count'), startAt(start), limit(10));

        if (exploreData.popularState && (exploreData.keyword == "" && exploreData.address == "" && exploreData.selectedId == "")) {
            totalQuery = query(collection(db, "video_data"), orderBy('follers', "desc"))
        }
        if (exploreData.popularState && (exploreData.keyword !== "" && exploreData.address !== "" && exploreData.selectedId !== "")) {
            totalQuery = query(collection(db, "video_data"), keywordQuery, addressQuery, idQuery, orderBy('follers', "desc"))
        }
        if (exploreData.popularState && (exploreData.keyword !== "" && exploreData.address !== "")) {
            totalQuery = query(collection(db, "video_data"), keywordQuery, addressQuery, orderBy('follers', "desc"))
        }
        if (exploreData.popularState && (exploreData.keyword !== "")) {
            totalQuery = query(collection(db, "video_data"), keywordQuery, orderBy('follers', "desc"))
        }
        if (exploreData.popularState && (exploreData.address !== "")) {
            totalQuery = query(collection(db, "video_data"), addressQuery, orderBy('follers', "desc"))
        }
        if (exploreData.popularState && (exploreData.selectedId !== "")) {
            totalQuery = query(collection(db, "video_data"), idQuery, orderBy('follers', "desc"))
        }
        if (exploreData.popularState && (exploreData.keyword !== "" && exploreData.selectedId !== "")) {
            totalQuery = query(collection(db, "video_data"), keywordQuery, idQuery, orderBy('follers', "desc"))
        }
        if (exploreData.popularState && (exploreData.address !== "" && exploreData.selectedId !== "")) {
            totalQuery = query(collection(db, "video_data"), addressQuery, idQuery, orderBy('follers', "desc"))
        }

        if (exploreData.trendingState && (exploreData.keyword == "" && exploreData.address == "" && exploreData.selectedId == "")) {
            totalQuery = query(collection(db, "video_data"), orderBy('views', "desc"))
        }
        if (exploreData.trendingState && (exploreData.keyword !== "" && exploreData.address !== "" && exploreData.selectedId !== "")) {
            totalQuery = query(collection(db, "video_data"), keywordQuery, addressQuery, idQuery, orderBy('views', "desc"))
        }
        if (exploreData.trendingState && (exploreData.keyword !== "" && exploreData.address !== "")) {
            totalQuery = query(collection(db, "video_data"), keywordQuery, addressQuery, orderBy('views', "desc"))
        }
        if (exploreData.trendingState && (exploreData.keyword !== "")) {
            totalQuery = query(collection(db, "video_data"), keywordQuery, orderBy('views', "desc"))
        }
        if (exploreData.trendingState && (exploreData.address !== "")) {
            totalQuery = query(collection(db, "video_data"), addressQuery, orderBy('views', "desc"))
        }
        if (exploreData.trendingState && (exploreData.selectedId !== "")) {
            totalQuery = query(collection(db, "video_data"), idQuery, orderBy('views', "desc"))
        }
        if (exploreData.trendingState && (exploreData.keyword !== "" && exploreData.selectedId !== "")) {
            totalQuery = query(collection(db, "video_data"), keywordQuery, idQuery, orderBy('views', "desc"))
        }
        if (exploreData.trendingState && (exploreData.address !== "" && exploreData.selectedId !== "")) {
            totalQuery = query(collection(db, "video_data"), addressQuery, idQuery, orderBy('views', "desc"))
        }
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

    } catch (err) {
        console.log(err);
    }
}

exports.getUserByAddress = async (req, res) => {
    try {
        const { address } = req.body;

        const q = query(userCollection, where("address", "==", address));
        const userSnapShot = await getDocs(q);
        let tempData = [];
        userSnapShot.forEach((doc) => {
            tempData.push({
                id: doc.id,
                user: doc.data()
            });
        })
        return res.status(200).send({
            user: tempData[0]
        })

    } catch (err) {
        console.log(err);
    }
}

exports.getVideoByAddress = async (req, res) => {

    try {
        const { address, count } = req.body;

        const q = query(dataCollection, where("address", "==", address), where("count", ">=", count), orderBy("count"), limit(8));
        const querySnapshot = await getDocs(q);
        let tempData = [];
        querySnapshot.forEach((doc) => {
            tempData.push({
                id: doc.id,
                data: doc.data()
            });
        });

        return res.status(200).send({
            videos: tempData
        })

    } catch (err) {
        console.log(err);
    }
}

exports.streamVideo = async (req, res) => {
    try {
        const range = req.headers.range;
        const name = req.query.name;

        const tempFile = `videos/${name}`;
        const file = getStorage().bucket('thehomeverse-io.appspot.com').file(tempFile);

        const metadata = await file.getMetadata();
        const size = metadata[0].size;
        const start = !range ? 0 : Number(range.replace(/\D/g, ''));
        const end = Math.min(start + 10 ** 6, size - 1);
        const contentLength = end - start + 1;

        const headers = {
            "Content-Range": `bytes ${start}-${end}/${size}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4",
        };
        res.writeHead(206, headers);
        file.createReadStream({ start, end }).pipe(res);
    } catch (err) {
        console.log(err);
    }
}
