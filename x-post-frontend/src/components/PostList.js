import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Image, Header, Divider } from 'semantic-ui-react'

let PostList = ({ posts }) => (
  <Card.Group doubling stackable itemsPerRow={3}>
    {posts.map(post => (
      <Card key={post.id}>
        {post.headerImage && post.headerImage.src && (
          <Image
            as={Link}
            to={`/@${post.author.username}/${post.slug}`}
            src={post.headerImage.src}
          />
        )}
        <Card.Content>
          <Header
            size="huge"
            className="post-header web-font"
            as={Link}
            to={`/@${post.author.username}/${post.slug}`}
          >
            {post.title}
            {post.subtitle && (
              <Header.Subheader className="web-font">
                <Divider hidden />
                {post.subtitle}
              </Header.Subheader>
            )}
          </Header>
        </Card.Content>
      </Card>
    ))}
  </Card.Group>
)

export default PostList
