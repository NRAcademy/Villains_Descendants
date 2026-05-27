.site-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 80px;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    transition: transform 0.35s ease;
}

.site-header.hidden {
    transform: translateY(-100%);
}

.header-inner {
    display: flex;
    gap: 60px;
}

.header-link {
    color: white;
    font-family: sans-serif;
    text-decoration: none;
}

#toggle-header-btn {
    position: absolute;
    right: 10px;
    background: none;
    border: none;
    color: white;
    font-size: 18px;
}

/* GAME */
.game-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}

/* MOBILE FIX */
@media (max-width: 768px) {

    .header-inner {
        gap: 15px;
        font-size: 12px;
    }

    .game-container {
        height: 100vh;
        transform: none; /* ВАЖНО: убрали масштаб */
    }

    .alchemy-section {
        left: 2%;
        top: 18%;
        width: 55%;
    }

    .menu-section {
        right: 2%;
        top: 22%;
        width: 42%;
    }
}
