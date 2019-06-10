import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = ({ data }) => (
  <Layout>
    <SEO title="Home" />
    <h1>{data.allDataJson.edges[0].node.collections[0].data[0].text}</h1>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
)

export const pageQuery = graphql`
  query IndexQuery {
    allDataJson {
      edges {
        node {
          collections {
            data {
              text
            }
          }
        }
      }
    }
  }
`

export default IndexPage
