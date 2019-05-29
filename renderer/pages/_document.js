import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleRegistry, ServerProvider } from 'trousers';

export default class MyDocument extends Document {
    static getInitialProps({ renderPage }) {
        const registry = new ServerStyleRegistry();

        // TODO: Append styleTags to the head
        const page = renderPage(App => props => (
            <ServerProvider registry={registry}>
                <App {...props} />
            </ServerProvider>
        ));

        // const styleTags = registry.get();

        return {
            page,
            // styleTags,
        };
    }

    render() {
        // console.log(this.props.styleTags);

        return (
            <html>
                <Head>{/* {this.props.styleTags} */}</Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}
