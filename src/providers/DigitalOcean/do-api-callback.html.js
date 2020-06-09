export default () => {
    return `<div style="top: 0; left: 0;position: fixed; height: 100%; width: 100%;background-color: black; display: flex; flex: 1; justify-content: center; align-items: center"><h3 style="color: dimgray">Loading...</h3></div>
    <script>
    var hash = window.location.hash.substr(1);
    window.location = 'zudvpnapp://callback?provider=digitalocean&' + hash;
    </script>`;
};
