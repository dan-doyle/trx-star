import Modal from 'react-bootstrap/Modal'
import './WelcomePage.scss';
import PlaylistButtons from './PlaylistButtons';
import { useEffect, useState } from "react";

function deleteSavePlaylist(name, indexedDB) {
    return new Promise(function(resolve, reject) {
        const dbPromise = indexedDB.open("SavedPlaylists", 1);
        dbPromise.onsuccess = () => {
            const db = dbPromise.result;
            const request = db.transaction("playlists", "readwrite")
                .objectStore("playlists")
                .delete(name);
            request.onsuccess = (e) => {
                resolve(e);
            }
        }
        dbPromise.onerror = (e) => {
            console.error("Delete failure.")
            reject(e);
        }
    })
}

function getSavedPlaylists(indexedDB) {
    return new Promise(function(resolve, reject) {
        const dbPromise = indexedDB.open("SavedPlaylists", 1)
        dbPromise.onupgradeneeded = () => {
            const db = dbPromise.result;
            const request = db.createObjectStore("playlists", { keyPath: "name" });
            reject("Created object store");
        }
        dbPromise.onsuccess = () => {
            const db = dbPromise.result;
            const request = db.transaction("playlists", "readonly")
                .objectStore("playlists")
                .getAll();
            request.onsuccess = (e) => {
                resolve(e);
            }
        }
        dbPromise.onerror = (e) => {
            reject(e);
        }
    })
}

const LoadModal = ({show, unshow, indexedDB, setButtonDisabled}) => {

    const [ playlists, setPlaylists ] = useState([]);
    
    // Handler for delete button
    const handleDelete = (playlist) => {
        deleteSavePlaylist(playlist.name, indexedDB)
    }

    // Playlist react state updated on delete
    useEffect(() => {
        getSavedPlaylists(indexedDB)
        .then(function(e) {
            var playlists = e.target.result;
            if (playlists.length === 0) {
                setButtonDisabled(true);
                setPlaylists(playlists);
                unshow();
            } else {
                setButtonDisabled(false);
                setPlaylists(playlists);
            }
        })
        .catch(function(e) {
            console.error(e.target.error);
        })
    }, [setButtonDisabled, indexedDB, playlists, unshow]);

    // Playlist array passed to component PlaylistButtons to be displayed
    return (
        <Modal
            show={show}
            onHide={unshow}
            backdrop="static"
            scrollable={false}
            centered>
            <PlaylistButtons
                playlists={playlists}
                handleDelete={handleDelete}/>
            <Modal.Footer>
                <button
                    onClick={unshow}
                    className="load-modal__close">
                    Cancel
                </button>
            </Modal.Footer>
        </Modal>
    )

}

export default LoadModal