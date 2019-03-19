import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Image, Header, Divider, Label } from 'semantic-ui-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'

let PostList = ({ posts, showAuthor }) => (
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
        {(post.seriesCount > 0 || showAuthor) && (
          <Card.Content extra>
            {showAuthor && post.author && (
              <Label image basic as={Link} to={`/@${post.author.username}`} color="grey">
                <img src={`${process.env.PUBLIC_URL}/img/default-avatar.png`} alt="" />
                {post.author.username}
              </Label>
            )}
            {post.seriesCount > 0 && (
              <Label basic color="blue">
                <FontAwesomeIcon icon={faCopy} />
                {' '}
                {post.seriesCount}
                {' '}
                篇系列文
              </Label>
            )}
          </Card.Content>
        )}
      </Card>
    ))}
  </Card.Group>
)

PostList.defaultProps = {
  showAuthor: false,
}

export default PostList
