import forge from 'node-forge'

export default (content) => {
    content = forge.util.encode64(content)
    return `
<script>
function my() {
    setTimeout(function () {
        window.location.href = "zudvpnapp://callback?"
    }, 10000)
}
</script>
<h1>Safely close this page after installation.</h1>
<a onclick="my()" href="data:application/x-apple-aspen-config;base64,${content}">Install VPN configuration</a>
`;
}