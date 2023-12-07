using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;

namespace MasDen.HomeLibrary.Books.Commands.IndexBook;
public class IndexBookCommandHandler : IRequestHandler<IndexBookCommand>
{
	public Task Handle(IndexBookCommand request, CancellationToken cancellationToken)
	{
		throw new NotImplementedException();
	}
}
