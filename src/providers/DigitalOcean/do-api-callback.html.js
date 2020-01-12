export default () => {
    return `<h3>Loading...</h3>
    <script>
    var hash = window.location.hash.substr(1);
    window.location = 'zudvpnapp://callback?provider=digitalocean&' + hash;
    </script>`;
};
